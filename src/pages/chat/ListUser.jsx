import React, { useState, useEffect } from "react";
import { shortInput } from "../../store/convert";
import avatar from "../../image/avatar.jpg";
import { api } from "../../api/api";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useDispatch } from "react-redux";
let stompClient = null;

const ListUser = (props) => {
  const [active, setActive] = useState(null);
  const [listUser, setListUser] = useState([]);
  const dispatch = useDispatch();

  const connect = () => {
    let socket = new SockJS(api + "/ws");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    stompClient.subscribe("/user/admin/get-all", (payload) => {
      let payloadData = JSON.parse(payload.body);

      setListUser(payloadData);
    });

    stompClient.send("/app/get-all-message", {}, {});
  };

  const onError = (err) => {
    console.log(err);
  };

  useEffect(() => {
    connect();

    return () => {
      stompClient.disconnect();
    };
  }, []);

  return (
    <div className="chatUser">
      <div className="chatUserTitle">Chating</div>
      {listUser.length > 0 &&
        listUser.map((user, index) => {
          return (
            <div
              key={index}
              className={active === index ? "chatItem chatactive" : "chatItem"}
              onClick={() => {
                setActive(index);
                dispatch({ type: "TAB_CHAT", tab: user });
              }}
            >
              <img className="avatar" src={avatar} />
              <p>{shortInput(user, 20)}</p>
            </div>
          );
        })}
    </div>
  );
};
export default ListUser;
