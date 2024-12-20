import React, { forwardRef, useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface Props {
  initialValue?: string;
  toolbar?: string;
}

const Tiny = forwardRef(
  (
    {
      initialValue = "",
      toolbar = "undo redo | casechange blocks | italic backcolor | " +
        "link image | alignleft aligncenter alignright alignjustify | " +
        "bullist numlist checklist outdent indent",
    }: Props,
    ref
  ) => {
    
    useEffect(() => {
      const intervalId = setInterval(() => {
        const notificationElements = document.getElementsByClassName(
          "tox-notification tox-notification--in tox-notification--warning"
        );

        if (!notificationElements) return;

        // @ts-ignore

        Array.from(notificationElements).forEach((item) => {
          console.log("itemL:::", item);
          // @ts-ignore
          item.style.display = "none";
        });
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }, []);

    return (
      <div
        style={{
          flex: 1,
          minHeight: 400,
          background: "#f2f2f256",
          borderRadius: 10,
        }}
      >
        <Editor
          initialValue={initialValue}
          apiKey="osncr9j02siif0cfu10o88lc9ng73q2ej7mmkla1gd4ohis8"
          // @ts-ignore
          onInit={(evt, editor) => (ref.current = editor)}
          init={{
            // @ts-ignore
            selector: "textarea#file-picker,textarea",
            height: 400,
            width: "100%",
            menubar: false,
            plugins: [
              "a11ychecker",
              "advlist",
              "advcode",
              "advtable",
              "autolink",
              "media",
              "checklist",
              "export",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "powerpaste",
              "fullscreen",
              "formatpainter",
              "insertdatetime",
              "table",
              "help",
              "wordcount",
              "image code",
            ],
            toolbar: toolbar,

            image_title: true,

            automatic_uploads: true,

            file_picker_types: "image",

            file_picker_callback: (cb, value, meta) => {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
              input.addEventListener("change", (e: any) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                  const id = "blobid" + new Date().getTime();
                  // @ts-ignore
                  const blobCache = tinymce.activeEditor.editorUpload.blobCache;

                  // @ts-ignore
                  const base64 = reader.result.split(",")[1];
                  const blobInfo = blobCache.create(id, file, base64);
                  blobCache.add(blobInfo);
                  cb(blobInfo.blobUri(), { title: file.name });
                });
                reader.readAsDataURL(file);
              });
              input.click();
            },
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
          }}
        />
      </div>
    );
  }
);
// trigger
export default Tiny;
