import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import type { InputsCategory } from "../types/inputsCategory.type";
import { getCategories } from "../utils/common";

export default function FormCategory() {
  const originalCategories = getCategories();
  const [categoryData, setCategoryData] =
    useState<InputsCategory>(originalCategories);
  const defaultValues = categoryData;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InputsCategory>({
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray<InputsCategory>({
    control,
    name: "categories",
  });

  const onsubmit: SubmitHandler<InputsCategory> = (values) => {
    const inputData = values.categories.filter((val) => val.category);
    localStorage.setItem(
      "EnglishConversationPracticeCategory",
      JSON.stringify(inputData)
    );
    setCategoryData({ categories: inputData });
  };

  const onerror: SubmitErrorHandler<InputsCategory> = (err) => console.log(err);

  return (
    <>
      <p>カテゴリ名を登録</p>
      <Form onSubmit={handleSubmit(onsubmit, onerror)} noValidate>
        {fields.map((field: any, index: number) => (
          <Form.Group className="my-4" key={field.id}>
            <Row>
              <Col>
                <Form.Control
                  id={`category${index + 2}`}
                  as="input"
                  {...register(`categories.${index}.category`)}
                />
                <div className="text-danger pt-2">
                  {!index && errors.categories?.[index]?.category?.message}
                </div>
              </Col>
              <Col>
                {index ? (
                  <Button
                    variant="primary"
                    className="py-1 px-2"
                    onClick={() => remove(index)}
                  >
                    削除
                  </Button>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </Form.Group>
        ))}

        <div className="text-center mt-5">
          <Button
            variant="primary"
            className="py-3 px-5 me-3"
            onClick={() => append({ category: "" })}
          >
            カテゴリ名を追加する
          </Button>
          <Button variant="primary" type="submit" className="py-3 px-5">
            保存する
          </Button>
        </div>
      </Form>
    </>
  );
}
