import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
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
    : { listname: "", questionArray: [], questionKeyArray: [] };
  const [questionArray, setQuestionArray] = useState<(string | undefined)[]>(
    keyNumber ? currentValues?.questionArray ?? [] : []
  );
  const [questionKeyArray, setQuestionKeyArray] = useState<number[]>(
    keyNumber ? currentValues?.questionKeyArray ?? [] : []
  );

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
    const questionData = questionArray.filter((val) => val);
    values.questionKeyArray = questionKeyData;
    values.questionArray = questionData;
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
