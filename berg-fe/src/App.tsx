import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ROUTES_FRONTEND } from './constant';

import Login from './components/pages/Login';
import SnackbarComponent from './components/molecules/Snackbar/Snackbar';
import Layout from './components/utils/Layout';
import Dashboard from './components/pages/Dashboard';
import Project from './components/pages/Project';
import Batch from './components/pages/Batch';

import {PrivateRoute} from './components/utils/PrivateRoute';
import {PublicOnlyRoute} from './components/utils/PublicOnlyRoute';
import Team from './components/pages/Team';


export default function App() {
  return (
    <Router>
    <SnackbarComponent />
    <Routes>
        {/* Public routes - redirect authenticated users */}
        <Route element={<PublicOnlyRoute />}>
            <Route path={ROUTES_FRONTEND.LOGIN} element={<Login />} />
        </Route>

        {/* Private routes - require authentication */}
        <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
                <Route path={ROUTES_FRONTEND.HOME} element={<Dashboard />} />
                <Route path={ROUTES_FRONTEND.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTES_FRONTEND.PROJECTS} element={<Project />} />
                <Route path={ROUTES_FRONTEND.BATCH} element={<Batch />} />
                <Route path={ROUTES_FRONTEND.TEAM} element={<Team/>} />
            </Route>
        </Route>
    </Routes>
</Router>
  )
}