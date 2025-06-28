import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { MedplumClient } from '@medplum/core';
import { MedplumProvider } from '@medplum/react';
import '@medplum/react/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router';
import { App } from './App';

const medplum = new MedplumClient({
  onUnauthenticated: () => (window.location.href = '/'),
  baseUrl: 'http://localhost:8080/',
  fhirUrlPath: 'fhir',
  cacheTime: 60000,
  autoBatchTime: 100,
  extendedMode: false,
});

medplum.getProfile = () => {
  return {
    resourceType: 'Practitioner',
    id: 'example-practitioner',
    name: [{ given: ['John'], family: 'Doe' }],
    identifier: [
      {
        system: 'http://example.com/identifiers',
        value: '12345',
      },
    ],
  };
};

medplum.getProjectMembership = () => {
  return {
    resourceType: 'ProjectMembership',
    id: 'example-membership',
    project: { reference: 'Project/example-project' },
    user: { reference: 'User/123' },
    profile: { reference: 'Practitioner/example-practitioner' },
  };
};

const theme = createTheme({
  headings: {
    sizes: {
      h1: {
        fontSize: '1.125rem',
        fontWeight: '500',
        lineHeight: '2.0',
      },
    },
  },
  fontSizes: {
    xs: '0.6875rem',
    sm: '0.875rem',
    md: '0.875rem',
    lg: '1.0rem',
    xl: '1.125rem',
  },
});

const router = createBrowserRouter([{ path: '*', element: <App /> }]);

const navigate = (path: string): Promise<void> => router.navigate(path);

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);
root.render(
  <StrictMode>
    <MedplumProvider medplum={medplum} navigate={navigate}>
      <MantineProvider theme={theme}>
        <Notifications position="bottom-right" />
        <RouterProvider router={router} />
      </MantineProvider>
    </MedplumProvider>
  </StrictMode>
);
