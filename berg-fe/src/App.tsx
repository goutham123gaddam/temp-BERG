// import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/pages/Login';
import SnackbarComponent from './components/molecules/Snackbar/Snackbar';
import { ROUTES_FRONTEND } from './constant';
import PrivateRoute from './components/templates/PrivateRoute';
import Layout from './components/templates/Layout';
import Dashboard from './components/pages/Dashboard';
import Project from './components/pages/Project';
import Batch from './components/pages/Batch';
import ProtectedRoute from './components/templates/ProtectedRoute';


export default function App() {
  return (
    <Router>
      <SnackbarComponent />
      <Routes>
        {/* public routes */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES_FRONTEND.LOGIN} element={<Login />} />
        </Route>


        {/* private routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />} >
            <Route path={ROUTES_FRONTEND.HOME} element={<Dashboard />} />
            <Route path={ROUTES_FRONTEND.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES_FRONTEND.PROJECTS} element={<Project />} />
            <Route path={ROUTES_FRONTEND.BATCH} element={<Batch/>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}