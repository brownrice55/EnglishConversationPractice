import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormAudioSelect from "./FormAudioSelect";
import { getAudio } from "../utils/common";

export default function FormAudio() {
  const audio = getAudio();
  const [form, setForm] = useState<string[]>(audio);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const handleSave = () => {
    localStorage.setItem(
      "EnglishConversationPracticeAudio",
      JSON.stringify(form)
    );
  };

  const handleUpdate = (value: string, indexNo: number) => {
    if (!indexNo) {
      setForm((prev) => [value, prev[1]]);
    } else {
      setForm((prev) => [prev[0], value]);
    }
  };

  useEffect(() => {
    setIsDisabled(audio.toString() === form.toString());
  }, [form]);

  return (
    <>
      <p>音声を設定してください。</p>
      <Form>
        <FormAudioSelect
          label="質問の音声"
          name="question"
          indexNo={0}
          value={form[0]}
          onUpdate={handleUpdate}
        />
        <FormAudioSelect
          label="解答例の音声"
          name="answer"
          indexNo={1}
          value={form[1]}
          onUpdate={handleUpdate}
        />
        <div className="text-center mt-5">
          <Button
            className="px-5 py-3 mx-3"
            variant="primary"
            onClick={handleSave}
            disabled={isDisabled}
          >
            設定する
          </Button>
        </div>
      </Form>
    </>
  );
}
