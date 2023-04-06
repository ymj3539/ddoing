import React, { useEffect } from "react";
import tw, { css, styled, theme } from "twin.macro";
import VerticalTabs from "../components/user/LeftVerticalTab";
import { Container, Header, Footer } from "../components/common/index";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/configStore.hooks";
import MultiColorProgressBar from "../components/user/LevelBar";
import { useNavigate } from "react-router-dom";

interface Reading {
  name: string;
  value: number;
  color: string;
}

interface DrawingListType {
  userId: string;
  drawingPath: string;
  percentage: number;
  word: string;
  mean: string;
}
// const [level, setLevel] = useState<number>(users.level);
// const [exp, setExp] = useState<number>(users.exp);

// useEffect(() => {
//   setLevel(users.level);
//   setExp(users.exp);
// }, [users]);\

const MyPage = () => {
  const users = useAppSelector((state) => state.user.userData);
  const level = 0;
  const exp = useAppSelector((state) => state.user.userData.exp);

  let readings: Reading[] = [
    {
      name: "EXP",
      value: exp === null ? 0 : Math.round(exp / 2),
      color: "#eb4d4b",
    },
    {
      name: "Blueberries",
      value: exp === null ? 100 : 100 - Math.round(exp / 2),
      color: "#22a6b3",
    },
  ];
  const navigate = useNavigate();

  useEffect(() => {
    if (!users.id) {
      navigate("/login");
    }
  }, []);

  return (
    <ContaineDiv>
      {/* Header */}
      <Header />
      <DummyDiv></DummyDiv>
      <FontStyle>
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
            <VerticalTabs />
          </Box>
        </BoxContentDiv>
      </FontStyle>
    </ContaineDiv>
  );
};

export default MyPage;
// style
const DummyDiv = styled.div(tw`h-20`);

//프로필사진
// tw`h-52 object-cover rounded-md bg-slate-500`,
const ContaineDiv = styled.div(
  tw``,
  css`
    width: 100%;
    height: 100%;
  `
);

const ProfileDiv = styled.div(
  tw`flex items-center content-between border border-black`,
  css`
    width: 100%;
    height: 30%;
  `
);

const ProfileWrapper = styled.div(
  tw`flex border border-red-500`,
  css`
    height: 100%;
    width: 100%;
  `
);

const BoxContentDiv = styled.div(
  tw`border border-blue-500`,
  css`
    height: 70%;
    width: 100%;
  `
);

const CustomedImage = styled.img`
  width: 10rem;
  height: 10rem;
  display: flex;
  float: left;
  border-radius: 70%;
`;

const Profile = styled.div(
  tw`flex flex-col items-center rounded-sm border border-green-500`,
  css`
    width: 30%;
  `
);

const ProfileName = styled.span`
  display: block;
  text-align: center;
  border-radius: 70%;
`;

const TabStyle = {
  display: "flex",
  height: "100%",
  width: "100%",
};

// level 글자
const LevelStyle = styled.div`
  display: "flex";
  font-size: 50px;
`;

// level 영역
const LevelArea = styled.div(
  tw`flex flex-col border border-yellow-500`,
  css`
    width: 100%;
    height: 100%;
  `
);
const FontStyle = styled.div(
  tw``,
  css`
    font-family: "insungitCutelivelyjisu";
    height: 100%;
  `
);
