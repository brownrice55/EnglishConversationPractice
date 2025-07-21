import { useState } from "react";
import type { Inputs } from "../types/inputs.type";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import VolumeIcons from "./VolumeIcons";

type PracticeRandomProps = {
  data: Map<number, Inputs>;
  randomIndexArray: number[];
  lang: string[];
};
export default function PracticeRandom({
  data,
  randomIndexArray,
  lang,
}: PracticeRandomProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentKey: number = randomIndexArray[currentIndex];
  const displayData: Inputs | undefined = data.get(currentKey);
  const answersLength: number =
    displayData && displayData.answers ? displayData.answers.length : 0;

  const [displayAnswer, setDisplayAnswer] = useState<boolean>(false);
  const [volumeIconsOn, setVolumeIconsOn] = useState<boolean[]>(
    Array(answersLength).fill(false)
  );

  const handleDisplayAnswer = () => {
    setDisplayAnswer((prev) => !prev);
  };

  const handleDisplayNextQuestion = () => {
    setDisplayAnswer((prev) => !prev);
    setCurrentIndex((prev) =>
      prev === randomIndexArray.length - 1 ? 0 : prev + 1
    );
  };

  const handleAudioOnOff = (e: any) => {
    const index: number = parseInt(e.currentTarget.dataset.key);
    const newArray = Array(answersLength).fill(false);
    newArray[index] = !volumeIconsOn[index];
    setVolumeIconsOn(newArray);
    if (newArray[index]) {
      const text =
        index === 0
          ? displayData?.question
          : index === 1
          ? displayData?.answer
          : displayData?.answers[index - 2].answer;
      const voice = new SpeechSynthesisUtterance(text);
      voice.lang = index === 0 ? lang[0] : lang[1];
      voice.rate = 0.5;
      speechSynthesis.cancel();
      speechSynthesis.speak(voice);

      voice.onend = () => {
        setVolumeIconsOn((prev) => {
          const newArray = [...prev];
          newArray[index] = false;
          return newArray;
        });
      };
    } else {
      speechSynthesis.cancel();
    }
  };

  return (
    <>
      <Stack gap={3}>
        <Row className="mt-4">
          <Col>
            <Form.Group>
              <Form.Select aria-label="category">
                <option value="1">全ての会話</option>
                <option value="2">仕事</option>
                <option value="3">趣味</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col className="text-end">
            <Button variant="secondary" className="py-2 px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-paperclip"
                viewBox="0 0 16 16"
              >
                <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z" />
              </svg>
              もう一度
            </Button>
          </Col>
        </Row>

        <div className="mt-5 p-3 fs-3 fw-light">
          <span className="pe-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-chat-text"
              viewBox="0 0 16 16"
            >
              <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
              <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8m0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5" />
            </svg>
          </span>
          {displayData?.question}
          <Button
            variant="light"
            className="p-1 ms-2"
            data-key={0}
            onClick={(e) => handleAudioOnOff(e)}
          >
            <VolumeIcons volumeIconsOn={volumeIconsOn} index={0} />
          </Button>
        </div>

        {!displayAnswer && (
          <div className="text-center">
            <Button
              variant="primary"
              className="py-3 px-5"
              onClick={handleDisplayAnswer}
            >
              回答例を見る
            </Button>
          </div>
        )}

        {displayAnswer && (
          <>
            <div className="px-3 py-1 bg-light">
              <div className="p-2 fs-3 fw-light">
                <p className="fs-6 m-0">回答例1</p>
                <span className="pe-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-chat-text"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
                    <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8m0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5" />
                  </svg>
                </span>
                {displayData?.answer}
                <Button
                  variant="light"
                  className="p-1 ms-2"
                  data-key={1}
                  onClick={(e) => handleAudioOnOff(e)}
                >
                  <VolumeIcons volumeIconsOn={volumeIconsOn} index={1} />
                </Button>
              </div>

              {displayData?.answers.map((val, index) => (
                <>
                  {val.answer && (
                    <div className="p-2 fs-3 fw-light" key={index + 2}>
                      <p className="fs-6 m-0">回答例{index + 2}</p>
                      <span className="pe-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-chat-text"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
                          <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8m0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5" />
                        </svg>
                      </span>
                      {val.answer}
                      <Button
                        variant="light"
                        className="p-1 ms-2"
                        data-key={index + 2}
                        onClick={(e) => handleAudioOnOff(e)}
                      >
                        <VolumeIcons
                          volumeIconsOn={volumeIconsOn}
                          index={index + 2}
                        />
                      </Button>
                    </div>
                  )}
                </>
              ))}
            </div>

            <div className="text-center">
              <Button
                variant="primary"
                className="py-3 px-5"
                onClick={handleDisplayNextQuestion}
              >
                次の問題へ
              </Button>
            </div>
          </>
        )}
      </Stack>
    </>
  );
}
