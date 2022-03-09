import React from "react";
import { Routes, Route } from "react-router-dom";
import Question from './Question'
import Profile from './Profile'

export default function MainRoutes() {
  return (
      <Routes>
        <Route exact path="/" element={<Question/>} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
  );
}
