import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./user/Login";
import Register from "./user/Register";
import Reset from "./user/Reset"
import ResetAck from './user/ResetAck'
import ResetPassword from './user/ResetPassword'
import Landing from "./postauth/Landing";

export default function KGQARoutes() {
  return (
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route path="/reset" element={<Reset/>} />
        <Route path="/reset_ack" element={<ResetAck/>} />
        <Route path="/reset_password/:token" element={<ResetPassword/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/home/*" element={<Landing/>} />
      </Routes>
  );
}
