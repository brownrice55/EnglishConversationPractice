import { useMemo } from "react";
import Nav from "react-bootstrap/Nav";
import Header from "../components/Header";
import PracticeRandom from "../components/PracticeRandom";
import { getData, getRandomIndexArray, getAudio } from "../utils/common";

export default function Practice() {
  const data = getData();
  const randomIndexArray = useMemo(() => getRandomIndexArray(data), []);
  const lang = getAudio();

  return (
    <>
      <Header
        title="練習"
        description="練習のページです"
        keywords="英語,英会話"
      />
      <Nav fill variant="tabs" defaultActiveKey="/" className="mt-3">
        <Nav.Item>
          <Nav.Link href="/">ランダム</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1">もう一度</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">リスト</Nav.Link>
        </Nav.Item>
      </Nav>
      <PracticeRandom
        data={data}
        randomIndexArray={randomIndexArray}
        lang={lang}
      />
    </>
  );
}
