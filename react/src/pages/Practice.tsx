import { useMemo, useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Header from "../components/Header";
import PracticeRandom from "../components/PracticeRandom";
import PracticeList from "../components/PracticeList";
import {
  getData,
  getRandomIndexArray,
  getAudio,
  getListData,
} from "../utils/common";
import type { Inputs } from "../types/inputs.type";
import { useNavigate } from "react-router-dom";

export default function Practice() {
  const originalData = getData();
  const originalListData = getListData();
  const [data, setData] = useState<Map<number, Inputs>>(originalData);
  const randomIndexArray = useMemo(() => getRandomIndexArray(data), []);
  const [filteredData, setFilteredData] = useState<Map<number, Inputs>>(
    new Map([...data].filter(([, val]) => val.isOnceAgain === true))
  );
  const [filteredRandomIndexArray, setFilteredRandomIndexArray] = useState<
    number[]
  >(getRandomIndexArray(filteredData));

  const lang = getAudio();

  const handleUpdate = (updatedData: Map<number, Inputs>) => {
    setData(updatedData);
    const updatedFilteredData = new Map(
      [...updatedData].filter(([, val]) => val.isOnceAgain === true)
    );
    setFilteredData(updatedFilteredData);
    setFilteredRandomIndexArray(getRandomIndexArray(updatedFilteredData));
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (!originalData.size) {
      navigate("/settings/add");
    }
  }, [originalData.size]);

  return (
    <>
      <Header
        title="練習"
        description="練習のページです"
        keywords="英語,英会話"
      />
      <Tabs
        fill
        defaultActiveKey="random"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="random" title="ランダム">
          <PracticeRandom
            data={data}
            randomIndexArray={randomIndexArray}
            lang={lang}
            title="random"
            onUpdate={handleUpdate}
          />
        </Tab>
        {filteredData.size ? (
          <Tab eventKey="again" title="もう一度">
            <PracticeRandom
              data={filteredData}
              randomIndexArray={filteredRandomIndexArray}
              lang={lang}
              title="again"
              onUpdate={() => {}}
            />
          </Tab>
        ) : (
          ""
        )}
        {originalListData.size ? (
          <Tab eventKey="list" title="リスト">
            <PracticeList />
          </Tab>
        ) : (
          ""
        )}
      </Tabs>
    </>
  );
}
