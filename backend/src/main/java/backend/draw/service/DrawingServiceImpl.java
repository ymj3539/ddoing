package backend.draw.service;

import backend.draw.domain.DrawingScoreEntity;
import backend.draw.domain.SentenceEntity;
import backend.draw.domain.UserDrawingEntity;
import backend.draw.domain.WordEntity;
import backend.draw.dto.*;
import backend.draw.repository.DrawingScoreRepository;
import backend.draw.repository.SentenceRepository;
import backend.draw.repository.UserDrawingRepository;
import backend.draw.repository.WordRepository;
import backend.user.UserEntity;
import backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class DrawingServiceImpl implements DrawingService {
    private final UserRepository userRepository;
    private final WordRepository wordRepository;
    private final SentenceRepository sentenceRepository;
    private final UserDrawingRepository userDrawingRepository;
    private final DrawingScoreRepository drawingScoreRepository;

    private final long LEVELUP_STANDARD = 200L;
    private final int ONE_DRAWING_SCORE = 5;

    @Value("${part.upload.path}")   // application.properties 에서 ec2 path 로 변경
    private String userDrawingPath;

    private String getFullPath(String imgPath, String fileName) {
        return imgPath + fileName;
    }

    @Override
    public void saveFile(MultipartFile drawingImg, UserDrawingDTO userDrawingDTO) throws IOException {
        System.out.println("multipart: "+drawingImg+" userDTO: "+userDrawingDTO);
    	String filename = "";
    	try {
    		filename = drawingImg.getOriginalFilename(); //원본 파일 이름
    	}
    	catch(NullPointerException e) {
            //canvas.dataURL() 속성은 파일 이름을 추가할 수 없는 구조임
    		filename = userDrawingDTO.getUserId()+"_"+userDrawingDTO.getWordId()+".jpg";
    	}
        String storeFileName = createStoreFileName(filename);   // 저장할 파일명으로 변경
        String storedPath = getFullPath(userDrawingPath, storeFileName);   // 저장 위치 + custom 된 파일명

        // db에 저장
        // userId, worId 같을때 (percentage 비교후 저장)
        UserDrawingEntity oldDrawing = userDrawingRepository.findByUserIdAndWordId(userDrawingDTO.getUserId(), userDrawingDTO.getWordId());
        UserDrawingEntity result = null;

        // 이미 그림이 있을 경우
        if (oldDrawing != null) {
            // percentage에 맞춰서 그림 자체 비교 해줘야 됨 (서버 저장소에서도 갱신)
            Float newPercentage = userDrawingDTO.getPercentage();

            // percentage 갱신 (서버 저장소에서도 삭제 후 갱신)
            if (oldDrawing.getPercentage() <= newPercentage) {
                result = UserDrawingEntity.builder()
                        .id(oldDrawing.getId())
                        .userEntity(userRepository.findById(userDrawingDTO.getUserId()).orElseThrow())
                        .wordEntity(wordRepository.findById(userDrawingDTO.getWordId()).orElseThrow())
                        .drawingPath(storeFileName)
                        .percentage(newPercentage)
                        .build();

                // 서버 저장소에서 삭제
                File old = new File(userDrawingPath + oldDrawing.getDrawingPath());
                old.delete();

            } else {  // percentage 미갱신
                return;
            }
        } else {  // 그림이 없는 경우
            result = UserDrawingEntity.builder()
                    .userEntity(userRepository.findById(userDrawingDTO.getUserId()).orElseThrow())
                    .wordEntity(wordRepository.findById(userDrawingDTO.getWordId()).orElseThrow())
                    .drawingPath(storeFileName)
                    .percentage(userDrawingDTO.getPercentage())
                    .build();
        }
        drawingImg.transferTo(new File(storedPath));
        userDrawingRepository.save(result);
    }

    // 서버에 저장할 파일명 생성
    private String createStoreFileName(String originalFileName) {
        String ext = extractExt(originalFileName);
        String uuid = UUID.randomUUID().toString();
        return uuid + "." + ext;
    }

    // 원본파일 확장자 반환
    private String extractExt(String originalFileName) {
        int pos = originalFileName.lastIndexOf(".");
        return originalFileName.substring(pos + 1);
    }

    // 단어 + 예문 리스트 조회
    @Override
    public List<DrawingResponseDTO> getDrawingWords(){

        List<WordEntity> words = wordRepository.findWordsByRand();
        List<DrawingResponseDTO> results = new ArrayList<>();

        // 단어 6개
        for(WordEntity word : words) {
            SentenceEntity sentence =  sentenceRepository.findSentenceByWordId(word.getId());
            // id, word, mean, eng_sentence, ko_sentence, word_id
            DrawingResponseDTO result = DrawingResponseDTO.builder()
                    .id(word.getId())
                    .word(word.getWord())
                    .mean(word.getMean())
                    .picturePath(word.getPicturePath())
                    .engSentence(sentence.getEngSentence())
                    .koSentence(sentence.getKoSentence())
                    .build();

            results.add(result);
        }
        return results;
    }

    // 그림 평가 점수 저장
    @Override
    public boolean createDrawingScore(DrawingScoreRequestDTO drawingScoreRequestDTO){
        System.out.println("================="+(drawingScoreRequestDTO.getUserId()));

        DrawingScoreEntity drawingScoreEntity = DrawingScoreEntity.builder()
                .userEntity(userRepository.findById(drawingScoreRequestDTO.getUserId()).orElseThrow())
                .score(drawingScoreRequestDTO.getScore() * ONE_DRAWING_SCORE)
                .build();

        drawingScoreRepository.save(drawingScoreEntity);
        return true;
    }



    // 유저 경험치,레벨 업데이트
    @Override
    public boolean updateUserExpAndLevel(DrawingScoreRequestDTO drawingScoreRequestDTO) {
        UserEntity userEntity = userRepository.findById(drawingScoreRequestDTO.getUserId()).orElseThrow();

        Long newExp = userEntity.getExp() + drawingScoreRequestDTO.getScore() * ONE_DRAWING_SCORE;
        Long Level = userEntity.getLevel();

        if (newExp >= LEVELUP_STANDARD) {
            newExp -= LEVELUP_STANDARD;
            Level += 1;
        }

        UserEntity result = UserEntity.builder()
                .id(userEntity.getId())
                .password(userEntity.getPassword())
                .name(userEntity.getName())
                .email(userEntity.getEmail())
                .nickName(userEntity.getNickName())
                .exp(newExp)
                .level(Level)
                .build();

        userRepository.save(result);    // update
        return true;
    }


    // 갱신 점수 반환
    // userId, animationId, bestScore, exp, level
    @Override
    public DrawingScoreResponseDTO getUserScores(DrawingScoreRequestDTO drawingScoreRequestDTO) {
        updateUserExpAndLevel(drawingScoreRequestDTO);

        UserEntity userEntity = userRepository.findById(drawingScoreRequestDTO.getUserId()).orElseThrow();
        DrawingScoreResponseDTO drawingScoreResponseDTO = DrawingScoreResponseDTO.builder()
                .userId(drawingScoreRequestDTO.getUserId())
                .exp(userEntity.getExp())
                .level(userEntity.getLevel())
                .build();

        return drawingScoreResponseDTO;
    }

    // 명예의 전당
    @Override
    public List<UserDrawingResponseDTO> selectDrawingGallery() {
        List<UserDrawingEntity> userDrawingEntityList = userDrawingRepository.findByPercentage();
        List<UserDrawingResponseDTO> results = new ArrayList<>();

        for(UserDrawingEntity userDrawingEntity : userDrawingEntityList){
            WordEntity wordEntity = wordRepository.findById(userDrawingEntity.getWordId()).orElseThrow();
            UserEntity userEntity = userRepository.findById(userDrawingEntity.getUserId()).orElseThrow();
            // userId, drawingPath, percentage, word, mean
            UserDrawingResponseDTO userDrawingResponseDTO = UserDrawingResponseDTO.builder()
                    .userId(userDrawingEntity.getUserId())
                    .nickName(userEntity.getNickName())
                    .drawingPath(userDrawingEntity.getDrawingPath())
                    .percentage(userDrawingEntity.getPercentage())
                    .word(wordEntity.getWord())
                    .mean(wordEntity.getMean())
                    .build();

            results.add(userDrawingResponseDTO);
        }

        if(results.size() > 6){
            results = results.subList(0, 6);
        }

        return results;
    }

    // 사용자가 최근에 그린 그림 조회
    @Override
    public List<UserDrawingResponseDTO> selectUserRecentDrawing(String UserId) {
        List<UserDrawingEntity> userDrawingEntityList = userDrawingRepository.findById(UserId);
        List<UserDrawingResponseDTO> results = new ArrayList<>();

        for(int i=0; i<3; i++){
            if(userDrawingEntityList.size() > i){
                UserDrawingEntity userDrawingEntity = userDrawingEntityList.get(i);
                WordEntity wordEntity = wordRepository.findById(userDrawingEntity.getWordId()).orElseThrow();
                // userId, drawingPath, percentage, word, mean
                UserDrawingResponseDTO userDrawingResponseDTO = UserDrawingResponseDTO.builder()
                        .userId(userDrawingEntity.getUserId())
                        .drawingPath(userDrawingEntity.getDrawingPath())
                        .percentage(userDrawingEntity.getPercentage())
                        .word(wordEntity.getWord())
                        .mean(wordEntity.getMean())
                        .build();

                results.add(userDrawingResponseDTO);
            }else {
                UserDrawingResponseDTO userDrawingResponseDTO = UserDrawingResponseDTO.builder()
                        .userId(UserId)
                        .drawingPath(null)
                        .percentage(null)
                        .word(null)
                        .mean(null)
                        .build();

                results.add(userDrawingResponseDTO);
            }

        }

        return results;
    }


}
