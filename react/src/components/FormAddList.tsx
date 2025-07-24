import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import type { InputsList } from "../types/InputsList.type";
import ModalList from "./ModalList";
import { getData, getListData } from "../utils/common";

type FormAddListProps = {
  keyNumber: number;
};

export default function FormAddList({ keyNumber }: FormAddListProps) {
  const [questionArray, setQuestionArray] = useState<(string | undefined)[]>(
    []
  );
  const [questionKeyArray, setQuestionKeyArray] = useState<number[]>([]);
  const storeData = getListData();
  const originalData = getData();

  const keysArray: number[] = storeData.size
    ? Array.from(storeData.keys())
    : [];
  let nextId: number = keyNumber
    ? keyNumber
    : storeData.size
    ? keysArray[keysArray.length - 1]
    : 0;

  const defaultValues = {};

  const handleUpdate = (key: number, listId: number, action: string) => {
    const newQuestionArray = [...questionArray];
    const newQuestionKeyArray = [...questionKeyArray];
    if (action == "edit") {
      newQuestionArray[listId] = originalData.get(key)?.question;
      newQuestionKeyArray[listId] = key;
    } else {
      newQuestionArray[listId] = "";
      newQuestionKeyArray[listId] = 100000;
    }
    setQuestionArray(newQuestionArray);
    setQuestionKeyArray(newQuestionKeyArray);
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
    if (!keyNumber) {
      ++nextId;
    }
    const questionKeyData = questionKeyArray.filter((val) => val);
    values.questionKeys = questionKeyData;
    storeData.set(nextId, values);
    localStorage.setItem(
      "EnglishConversationPracticeList",
      JSON.stringify([...storeData])
    );
    setQuestionArray([]);
    setQuestionKeyArray([]);
    reset();
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
                <ModalList
                  listId={index}
                  onUpdate={handleUpdate}
                  data={originalData}
                  isFirstTime={true}
                />
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
