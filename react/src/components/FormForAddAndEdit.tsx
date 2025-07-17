import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import type { Inputs } from "../types/inputs.type";
import { getData } from "../utils/common";

export default function FormForAddAndEdit() {
  const originalData = getData();
  const [data, setData] = useState<Map<number, Inputs>>(originalData);

  const defaultValues = {
    question: "",
    answer: [],
    category: [],
  };

  const keysArray: number[] = data.size ? Array.from(data.keys()) : [];
  let nextId: number = data.size ? keysArray[keysArray.length - 1] : 0;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { fields, append } = useFieldArray({
    control,
    name: "answers",
  });

  const onsubmit: SubmitHandler<Inputs> = (values) => {
    ++nextId;
    data.set(nextId, values);
    localStorage.setItem(
      "EnglishConversationPractice",
      JSON.stringify([...data])
    );
    setData(data);
    reset();
  };

  const onerror: SubmitErrorHandler<Inputs> = (err) => console.log(err);

  const handleCancel = () => {
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onsubmit, onerror)} noValidate>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="question">質問（英語）</Form.Label>
        <Form.Control
          id="question"
          as="textarea"
          rows={5}
          {...register("question", {
            required: "必須です",
          })}
        />
        <div className="text-danger pt-2">{errors.question?.message}</div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="answer">解答例（英語）</Form.Label>
        <Form.Control
          id="answer"
          as="textarea"
          rows={5}
          {...register("answer", {
            required: "必須です",
          })}
        />
        <div className="text-danger pt-2">{errors.answer?.message}</div>
      </Form.Group>
      {fields.map((field: any, index: number) => (
        <Form.Group className="mb-3" key={field.id}>
          <Form.Label htmlFor={`answer${index + 2}`}>
            解答例{index + 2}（英語）
          </Form.Label>
          <Form.Control
            id={`answer${index + 2}`}
            as="textarea"
            rows={5}
            {...register(`answers.${index}.answer`)}
          />
        </Form.Group>
      ))}

      <div className="text-end">
        <Button
          variant="primary"
          className="py-2 px-4"
          onClick={() => append({ answer: "" })}
        >
          追加する
        </Button>
      </div>

      <Form.Group className="my-5">
        <Form.Select aria-label="category" {...register("category")}>
          <option value="1">仕事</option>
          <option value="2">趣味</option>
        </Form.Select>
      </Form.Group>

      <div className="text-center">
        <Button
          variant="primary"
          type="button"
          className="py-3 px-4 me-4"
          onClick={handleCancel}
        >
          キャンセルする
        </Button>
        <Button variant="primary" type="submit" className="py-3 px-5">
          登録する
        </Button>
      </div>
    </Form>
  );
}
