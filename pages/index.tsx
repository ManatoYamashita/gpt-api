import axios from 'axios';
import React, { useState } from 'react';

const Chat = () => {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateAnswer = async () => {
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/chatgpt', { prompt }, { timeout: 15000 });
      console.log('Response from API: ', res.data); // log the response to the console
      setAnswer(res.data.text);
    } catch (e: any) {
      if (e.code === 'ECONNABORTED') {
        setError('タイムアウト: 15秒以内に回答が返ってきませんでした。');
      } else {
        setError('エラーが発生しました。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto my-16 min-w-1/2 max-w-2xl px-4">
      <div className="bg-gray-700 rounded-md md:flex md:items-center md:justify-between py-4 px-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-white">Next ChatBot</h2>
        </div>
      </div>
      <div className="px-4">
        <div className="py-8">
          <label
            htmlFor="question"
            className="block font-medium leading-6 text-lg text-gray-900 pb-2"
          >
            質問フォーム：
          </label>
          <div className="mt-2">
            <textarea
              id="question"
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="質問したいことを入力してください"
              maxLength={500}
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end mb-8">
        <button
            type="button"
            className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            disabled={isLoading || prompt.length === 0}
            onClick={generateAnswer}
          >
            質問する
          </button>
        </div>
        {isLoading ? (
          <div className="font-medium leading-6 text-lg text-indigo-700 pb-2">読み込み中...</div>
        ) : (
          <>
            {error && <div className="mt-4 text-red-500">{error}</div>}
            {answer && (
              <>
                <div className="font-medium leading-6 text-lg text-gray-900 pb-2">回答：</div>
                <p className="mt-2 text-gray-700">{answer}</p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;