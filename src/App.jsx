import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Provider,
  defaultTheme
} from '@adobe/react-spectrum';
import Home from './pages/Home';
import ListExpanded from './pages/ListExpanded';

export default function App() {
  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lists/:listId" element={<ListExpanded />} />
        </Routes>
      </Router>
    </Provider>
  );
}
