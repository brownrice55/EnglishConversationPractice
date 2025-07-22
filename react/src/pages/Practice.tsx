import { useMemo, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Header from "../components/Header";
import PracticeRandom from "../components/PracticeRandom";
import { getData, getRandomIndexArray, getAudio } from "../utils/common";
import type { Inputs } from "../types/inputs.type";

export default function Practice() {
  const originalData = getData();
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
        <Tab eventKey="list" title="リスト">
          リスト
        </Tab>
      </Tabs>
    </>
  );
}
