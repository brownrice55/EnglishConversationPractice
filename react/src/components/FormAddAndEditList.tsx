import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import type { Inputs } from "../types/inputs.type";
import type { InputsList } from "../types/inputsList.type";
import ModalList from "./ModalList";
import { getData, getListData } from "../utils/common";

type FormAddAndEditListProps = {
  keyNumber: number;
  onUpdate?: (isEditing: boolean) => void;
};

export default function FormAddAndEditList({
  keyNumber,
  onUpdate,
}: FormAddAndEditListProps) {
  const listData = getListData();
  const originalData = getData();
  const currentValues = keyNumber
    ? listData.get(keyNumber)
    : {
        listname: "",
        questionArray: [],
        questionKeyArray: [],
        answersArray: [],
      };

  const getAnswersArray = (aCurrentValues: Inputs | undefined) => {
    let answers: string[] = [];
    if (aCurrentValues && aCurrentValues.answer) {
      answers = aCurrentValues.answer ? [aCurrentValues.answer] : [];
      if (aCurrentValues.answers[0].answer) {
        const otherAnswers: string[] = [];
        aCurrentValues.answers.forEach((val) => {
          if (val.answer) {
            otherAnswers.push(val.answer);
          }
        });
        answers = answers.concat(otherAnswers);
      }
    }
    return answers;
  };

  const [questionArray, setQuestionArray] = useState<(string | undefined)[]>(
    keyNumber ? currentValues?.questionArray ?? [] : []
  );
  const [questionKeyArray, setQuestionKeyArray] = useState<number[]>(
    keyNumber ? currentValues?.questionKeyArray ?? [] : []
  );

  const [answersArray, setAnswersArray] = useState(
    keyNumber ? currentValues?.answersArray ?? [] : []
  );

  const [errorMessage, setErrorMessage] = useState<string>("");

  const keysArray: number[] = listData.size ? Array.from(listData.keys()) : [];
  let nextId: number = keyNumber
    ? keyNumber
    : listData.size
    ? keysArray[keysArray.length - 1]
    : 0;

  const defaultValues = keyNumber ? listData.get(keyNumber) : {};

  const handleUpdate = (key: number, listId: number, action: string) => {
    const newQuestionArray = [...questionArray];
    const newQuestionKeyArray = [...questionKeyArray];
    const newAnswersArray = [...answersArray];
    if (action == "edit") {
      newQuestionArray[listId] = originalData.get(key)?.question;
      newQuestionKeyArray[listId] = key;
      newAnswersArray[listId] = getAnswersArray(originalData.get(key));
    } else {
      newQuestionArray[listId] = "";
      newQuestionKeyArray[listId] = 100000;
      newAnswersArray[listId] = [];
    }
    setQuestionArray(newQuestionArray);
    setQuestionKeyArray(newQuestionKeyArray);
    setAnswersArray(newAnswersArray);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InputsList>({
    defaultValues,
    mode: "onChange",
  });

  const onsubmit: SubmitHandler<InputsList> = (values) => {
    const answersData = answersArray.filter((val) => val[1]);
    if (!answersData[0].length) {
      setErrorMessage("1つ以上追加してください");
      return;
    }
    if (!keyNumber) {
      ++nextId;
    }
    const questionKeyData = questionKeyArray.filter((val) => val);
    const questionData = questionArray.filter((val) => val);
    values.questionKeyArray = questionKeyData;
    values.questionArray = questionData;
    values.answersArray = answersData;
    listData.set(nextId, values);
    localStorage.setItem(
      "EnglishConversationPracticeList",
      JSON.stringify([...listData])
    );
    setQuestionArray([]);
    setQuestionKeyArray([]);
    reset();
    if (keyNumber && onUpdate) {
      onUpdate(false);
    }
  };

  const onerror: SubmitErrorHandler<InputsList> = (err) => console.log(err);

  return (
    <>
      <Form onSubmit={handleSubmit(onsubmit, onerror)} noValidate>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="listname">リスト名</Form.Label>
          <Form.Control
            id="listname"
            as="input"
            {...register("listname", {
              required: "必須です",
            })}
          />
          <div className="text-danger pt-2">{errors.listname?.message}</div>
        </Form.Group>

        <ListGroup as="ol" numbered>
          {[...Array(10)].map((_, index) => (
            <ListGroup.Item as="li" key={index}>
              {questionArray[index] ? (
                <Row>
                  <Col>{questionArray[index]}</Col>
                  <Col className="text-end">
                    <ModalList
                      listId={index}
                      onUpdate={handleUpdate}
                      data={originalData}
                      isFirstTime={false}
                    />
                  </Col>
                </Row>
              ) : (
                <>
                  <ModalList
                    listId={index}
                    onUpdate={handleUpdate}
                    data={originalData}
                    isFirstTime={true}
                  />
                  {!index ? (
                    <span className="text-danger ms-3">{errorMessage}</span>
                  ) : (
                    ""
                  )}
                </>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>

        <div className="text-center mt-5">
          <Button variant="primary" type="submit" className="py-3 px-5">
            保存する
          </Button>
        </div>
      </Form>
    </>
  );
}
