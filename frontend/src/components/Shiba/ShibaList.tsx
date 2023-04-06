import React, { useState } from "react";
import tw, { css, styled, theme } from "twin.macro";
import myList from "./Shiba.json";
import ShibaModal from "./ShibaModal";
import { useAppSelector } from "../../redux/configStore.hooks";

const ShibaList = () => {
  const user = useAppSelector((state) => state.user.userData);
  const [openShibaModal, setOpenShibaModal] = useState<boolean>(false);
  const [nowName, setNowName] = useState<string>("");
  const [nowLevel, setNowLevel] = useState<number>(0);

  const onClickShiba = () => {
    setOpenShibaModal((prev) => !prev);
  };
  return (
    <AllWrapDiv>
      {myList.map((item: any, index: number) => {
        return (
          <OneWrapDiv>
            {user.level && item.level > user.level && (
              <NoDiv>
                <LockImg src="/assets/img/Lock.png" />
              </NoDiv>
            )}
            <OneWrapBtn
              onClick={() => {
                setOpenShibaModal((prev) => !prev);
                setNowLevel(item.level);
                setNowName(item.name);
              }}
            >
              <LevelDiv>{item.level}</LevelDiv>
              <ShibaImg
                src={`../../../ec2/model/Shiba_${item.name}_${item.level}/Shiba_${item.name}_${item.level}.png`}
              ></ShibaImg>
            </OneWrapBtn>
          </OneWrapDiv>
        );
      })}
      {openShibaModal && (
        <ShibaModal
          open={openShibaModal}
          setOpen={setOpenShibaModal}
          name={nowName}
          level={nowLevel}
        />
      )}
    </AllWrapDiv>
  );
};

export default ShibaList;

const AllWrapDiv = styled.div`
  display: flex;
  width: 90vw;
  height: 50vh;
  flex-wrap: wrap;
`;

const OneWrapBtn = styled.button`
  display: flex;
  position: relative;
  width: 20vw;
  height: 21vh;
  /* margin: 1vw; */
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 1vw;
  /* box-shadow: 4px 8px 8px hsl(0deg 0% 0% / 0.25); */
  z-index: 1;
`;

const OneWrapDiv = styled.div`
  display: flex;
  position: relative;
  width: 20vw;
  height: 23vh;
  margin: 1vw;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 1vw;
  /* box-shadow: 4px 8px 8px hsl(0deg 0% 0% / 0.25); */
  z-index: 1;
`;

const LockImg = styled.img`
  position: absolute;
  width: 2vw;
  right: 1vw;
  bottom: 1vw;
`;

const NoDiv = styled.div`
  /* display: flex; */
  position: absolute;
  width: 20vw;
  height: 23vh;
  margin: 10px;
  border-radius: 1vw;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #00000089;
  z-index: 999;
  /* border-radius: 1vw; */
  /* box-shadow: 4px 8px 8px hsl(0deg 0% 0% / 0.25); */
`;

const ShibaImg = styled.img`
  /* height: 50vw; */
  border-radius: 1vw;
  width: 25vw;
  height: 23vh;
  box-shadow: 4px 8px 8px hsl(0deg 0% 0% / 0.25);
  &:hover {
    box-shadow: -2px -2px 5px #fff;
  }
  /* width: 100%; */
`;

const LevelDiv = styled.div`
  position: absolute;
  display: flex;
  left: 1vw;
  top: 0.5vw;
  height: 25px;
  padding: 5px;
  text-align: left;
  justify-content: center;
  align-items: center;
  z-index: 999;
  font-size: 25px;
  color: ;
  /* background-color: white; */
`;
