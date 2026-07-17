import { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");

  const [msg, setMsg] = useState("");
  const [result, setResult] = useState(false);
  const [responseData, setResponseData] = useState({});

  function submit(e : React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    // const method = (document.getElementById("method") as HTMLInputElement).value;
    const loginIdValue = (document.getElementById("loginId") as HTMLInputElement).value;
    const loginPwValue = (document.getElementById("loginPw") as HTMLInputElement).value;
    const userNameValue = (document.getElementById("userName") as HTMLInputElement).value;
    const userPhoneValue = (document.getElementById("userPhone") as HTMLInputElement).value;

    const data = {
      loginId : loginIdValue,
      loginPw : loginPwValue,
      userName : userNameValue,
      userPhone : userPhoneValue
    }
    if (!loginIdValue || !loginPwValue || !userNameValue || !userPhoneValue) {
      setMsg("모든 필드를 입력해주세요");
      return;
    }
    axios
    .post(`http://localhost:8080/api-server/v1/auth/join`, { ...data })
    .then((response) => {
      console.log(response.data);
      setMsg("회원가입이 완료되었습니다");
      setResult(true);
      setResponseData(JSON.stringify(response.data.msg));
    })
     .catch((error) => {
    console.error(error);
    setMsg(error.response?.data?.msg ?? "회원가입에 실패했습니다");
    setResult(false);
  });

  }
  return (
    <>
        <p>안녕</p>
        
        <label htmlFor="method">method </label>
        <p>POST</p>
        {/* <input id="method" type="text" placeholder="method" /> */}
        
        <br />

        <label>data </label>
        <br />
        <label>id </label>
        <input type="text" id="loginId" placeholder="loginId" value={loginId} onChange={(e) => setLoginId(e.target.value)} />
        <br />

        <label>pw </label>
        <input type="text" id="loginPw" placeholder="loginPw" value={loginPw} onChange={(e) => setLoginPw(e.target.value)} />
        <br />

        <label>name </label>
        <input type="text" id="userName" placeholder="userName" value={userName} onChange={(e) => setUserName(e.target.value)} />
        <br />

        <label>phone </label>
        <input type="number" id="userPhone" placeholder="userPhone" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} />
        
        <br />
        <br />

        <button onClick={(e) => submit(e)}>통신</button>

        <p>message : {msg}</p>
        <p>result : {result}</p>
        <p>response : {JSON.stringify(responseData)}</p>
    </>
  )
}

export default App;