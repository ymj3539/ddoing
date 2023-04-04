import React from "react";
import tw, { css, styled, theme } from "twin.macro";
import VerticalTabs from "../components/user/LeftVerticalTab";
import { Container, Header, Footer } from "../components/common/index";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/configStore.hooks";
import MultiColorProgressBar from "../components/user/LevelBar";

interface Reading {
  name: string;
  value: number;
  color: string;
}

interface DrawingListType {
  userId: string
  drawingPath: string
  percentage: number
  word: string
  mean: string
}
// const [level, setLevel] = useState<number>(users.level);
// const [exp, setExp] = useState<number>(users.exp);

// useEffect(() => {
//   setLevel(users.level);
//   setExp(users.exp);
// }, [users]);\

const MyPage = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.user.userData);
  const level = 0;
  const exp = useAppSelector((state) => state.user.userData.exp);

  let readings: Reading[] = [
    {
      name: "EXP",
      value: exp === null ? 0 : exp,
      color: "#eb4d4b",
    },
    {
      name: "Blueberries",
      value: exp === null ? 100 : 100 - exp,
      color: "#22a6b3",
    },
  ];

  return (
    <ContaineDiv>
      {/* Header */}
      <FontStyle>
        <Header />
        <DummyDiv></DummyDiv>
        <ProfileDiv>
          <ProfileWrapper>
            <Profile>
              <CustomedImage src={`assets/img/ddio${level}.png`} />
              <ProfileName>{users.nickName} 님</ProfileName>
            </Profile>
            <LevelArea>
              <LevelStyle>Level {users.level}</LevelStyle>
              <div id="root"></div>
              <MultiColorProgressBar readings={readings} />
              {/* <CustomedBar /> */}
            </LevelArea>
          </ProfileWrapper>
        </ProfileDiv>
        <BoxContentDiv>
          <Box component="div" sx={TabStyle}>
            <VerticalTabs/>
          </Box>
          <Footer />
        </BoxContentDiv>
      </FontStyle>
    </ContaineDiv>
  );
};

// style
const DummyDiv = styled.div(tw`h-16`);

export default MyPage;

//프로필사진
// tw`h-52 object-cover rounded-md bg-slate-500`,
const ContaineDiv = styled.div`
  width: 100%;
  height: 100%;
`

const ProfileDiv = styled.div(
  tw`h-2/6 w-full`
)

const ProfileWrapper = styled.div(
  tw`flex`
)

const BoxContentDiv = styled.div`
  height: 66.66666%
`

const CustomedImage = styled.img`
  width: 10rem;
  height: 10rem;
  display: block;
  float: left;
  border-radius: 70%;
`;

const Profile = styled.div(
  tw`flex flex-col rounded-sm`,
  css`
    width: 30%;
  `
)

const ProfileName = styled.span`
  display: block;
  text-align: center;
  border-radius: 70%;
`;

const TabStyle = {
  display: "flex",
  height: "40rem"
};

// level 글자
const LevelStyle = styled.div`
  display: "flex";
  width: 40rem;
  padding-left: 150px;
  font-size: 50px;
`;

// level 영역
const LevelArea = styled.div`
  width: 70%
`;

const FontStyle = styled.div`
  font-family: "insungitCutelivelyjisu";
  height: 100vh;
  width: 100vh
`;
