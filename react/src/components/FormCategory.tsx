import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<InputsCategory>({
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray<InputsCategory>({
    control,
    name: "categories",
    keyName: "id",
  });

  const navigate = useNavigate();

  const onsubmit: SubmitHandler<InputsCategory> = (values) => {
    const inputData = values.categories
      .filter((val) => val.category)
      .map((val) => ({ ...val, categoryId: val.categoryId }));
    localStorage.setItem(
      "EnglishConversationPracticeCategory",
      JSON.stringify(inputData)
    );
    setCategoryData({ categories: inputData });
    navigate("/settings");
  };

  const onerror: SubmitErrorHandler<InputsCategory> = (err) => console.log(err);

  const handleCancel = () => {
    reset();
  };

  const handleAddField = () => {
    const lastId = categoryData.categories.length
      ? Math.max(...categoryData.categories.map((val) => val.categoryId || 0))
      : 0;
    const nextId = lastId + 1;
    append({ categoryId: nextId, category: "" });
  };

  return (
    <>
      <p>カテゴリ名を登録</p>
      <Form onSubmit={handleSubmit(onsubmit, onerror)} noValidate>
        {fields.map((field: any, index: number) => (
          <Form.Group className="my-4" key={index}>
            <Row>
              <Col>
                <Form.Control
                  id={`category${index}`}
                  as="input"
                  {...register(`categories.${index}.category`)}
                  defaultValue={field.category}
                />
                <Form.Control
                  type="hidden"
                  {...register(`categories.${index}.categoryId`, {
                    valueAsNumber: true,
                  })}
                  value={field.categoryId ?? 0}
                />
                <div className="text-danger pt-2">
                  {!index && errors.categories?.[index]?.category?.message}
                </div>
              </Col>
              <Col>
                <Button
                  variant="primary"
                  className="py-1 px-2"
                  onClick={() => remove(index)}
                >
                  削除
                </Button>
              </Col>
            </Row>
          </Form.Group>
        ))}

        <div className="text-end">
          <Button
            variant="primary"
            className="py-2 px-4 me-3"
            onClick={handleAddField}
          >
            カテゴリ名を追加する
          </Button>
        </div>
        <div className="text-center mt-5">
          <Button
            variant="primary"
            className="py-3 px-5 me-3"
            onClick={handleCancel}
          >
            キャンセルする
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="py-3 px-5"
            disabled={!isDirty || !isValid}
          >
            保存する
          </Button>
        </div>
      </Form>
    </>
  );
}
