import { createBrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage";
import DrawingPage from "../pages/DrawingPage"
const router = createBrowserRouter([
  {
    path: "",
    element: <MainPage/>,
    children: [
      
    ]
    // children: [
    //   {
    //     path: "dashboard",
    //     element: <Dashboard />,
    //   },
    //   {
    //     path: "about",
    //     element: <About />,
    //   },
    // ],
  },
  {
    path: "animation",
    element: <div>빈페이지 입니다.</div>,
  },
  {
    path: "drawing",
    element: <DrawingPage/>,
  },
  {
    path: "ranking",
    element: <div>빈페이지 입니다.</div>,
  },
  {
    path: "mypage",
    element: <div>빈페이지 입니다.</div>,
  },
]);

export default router