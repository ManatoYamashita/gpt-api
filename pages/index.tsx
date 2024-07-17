import axios from 'axios';
import React, { useState } from 'react';
import styles from '@/styles/chat.module.scss';

const Chat = () => {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateAnswer = async () => {
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/chatgpt', { 
        prompt: "次のプライバシーポリシーの文章を要約してください。その際、「ユーザが許されていること」と、「許されていないこと」、「企業が管理すること」、「ユーザが管理せなばならないこと」に分けてhtml形式で書いてください。 ```" + prompt + "```"
      }, { timeout: 20000 });
      console.log('Response from API: ', res.data); // log the response to the console
      setAnswer(res.data.text);
    } catch (e: any) {
      if (e.code === 'ECONNABORTED') {
        setError('タイムアウト: 20秒以内に回答が返ってきませんでした。');
      } else {
        setError('エラーが発生しました。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h2 className={styles.title}>Privacy Policy Summary</h2>
      </div>
      <div className={styles.form}>
        <label htmlFor="question" className={styles.label}>
          文章またはURL: 
        </label>
        <textarea
          id="question"
          className={styles.textarea}
          placeholder="Type your prompt here..."
          maxLength={3000}
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="button"
          className={styles.button}
          disabled={isLoading || prompt.length === 0}
          onClick={generateAnswer}
        >
          質問する
        </button>
        {isLoading ? (
          <div className={styles.loading}>読み込み中...</div>
        ) : (
          <>
            {error && <div className={styles.error}>{error}</div>}
            {answer && (
              <div className={styles.answerContainer}>
                <div className={styles.answerLabel}>回答：</div>
                <div
                  className={styles.answer}
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
