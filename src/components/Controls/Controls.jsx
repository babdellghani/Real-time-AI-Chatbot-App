import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "./Controls.module.css";
import TextareaAutosize from "react-textarea-autosize";

const Controls = ({ isLoading = false, onSend }) => {
  const [content, setContent] = useState("");
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (!isLoading) {
      textAreaRef.current.focus();
    }
  }, [isLoading]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSendMessage = () => {
    if (content.trim() !== "") {
      onSend(content);
      setContent("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.Controls}>
      <div className={styles.TextAreaContainer}>
        <TextareaAutosize
          className={styles.TextArea}
          placeholder="Message"
          value={content}
          minRows={1}
          maxRows={4}
          disabled={isLoading}
          ref={textAreaRef}
          onChange={handleContentChange}
          onKeyDown={handleKeyPress}
        />
      </div>
      <button className={styles.Button} onClick={handleSendMessage} disabled={isLoading}>
        <SendIcon />
      </button>
    </div>
  );
};

Controls.propTypes = {
  onSend: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default Controls;

function SendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#FFFFFF"
    >
      <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" />
    </svg>
  );
}
