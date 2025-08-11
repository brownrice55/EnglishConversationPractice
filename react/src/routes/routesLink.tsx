import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import App from "../App";
import Practice from "../pages/Practice";
import Settings from "../pages/Settings";
import AddOrEdit from "../pages/settings/AddOrEdit";
import Audio from "../pages/settings/Audio";
import Category from "../pages/settings/Category";
import AddList from "../pages/settings/AddList";
import EditList from "../pages/settings/EditList";
import NotFound from "../pages/NotFound";

const routesLink = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route path="/" element={<Practice />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/add" element={<AddOrEdit activeKey="/settings/add" />} />
      <Route path="/settings/edit" element={<AddOrEdit activeKey="/settings/edit" />} />
      <Route path="/settings/audio" element={<Audio />} />
      <Route path="/settings/category" element={<Category />} />
      <Route path="/settings/addList" element={<AddList />} />
      <Route path="/settings/editList" element={<EditList />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default routesLink;
