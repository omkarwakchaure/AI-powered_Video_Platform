import { createBrowserRouter } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import MainContainer from '../MainContainer';
import WatchPage from '../innerpages/watchPage/WatchPage';
import SearchResults from '../innerpages/searchPart/SearchResults';
import React from 'react';
import Shorts from '../innerpages/shorts/shorts';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <MainContainer />,
      },
      {
        path: 'watch',
        element: <WatchPage />,
      },
      {
        path: 'search',
        element: <SearchResults />,
      },
      {
        path: 'shorts',
        element: <Shorts />,
      },
    ],
  },
]);

export default router;
