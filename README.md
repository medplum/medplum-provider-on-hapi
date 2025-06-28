# medplum-provider-on-hapi

Demonstration of Medplum Provider app using HAPI as a backend.

## Setting up HAPI

Pull the HAPI docker image:

```bash
docker pull hapiproject/hapi:latest
```

Run the HAPI docker image and be sure to enable GraphQL:

```bash
docker run -p 8080:8080 -e HAPI_FHIR_GRAPHQL_ENABLED=true hapiproject/hapi:latest
```

Now the HAPI server is running on `http://localhost:8080/`.

Load some sample data into the HAPI server:

```bash
curl -H "Content-Type: application/json" -d @starter-bundle.json http://localhost:8080/fhir/
```

That creates the following resources:

1. `StructureDefinition` resources for the `Organization` and `Patient`
2. `SearchParameter` resources for `Organization-name` and `Patient-name`
3. Example `Practitioner` for the user
4. Example `Patient`

## Getting Started with Medplum Provider

Clone this repo.

Install the dependencies:

```bash
npm install
```

Then, run the app:

```bash
npm run dev
```

This app should run on `http://localhost:3000/`

## What changed?

The Medplum Provider app is primarily used with the Medplum backend, but it is FHIR native and largely works with other FHIR servers.

Here are the only changes we made to the original Medplum Provider app to work with HAPI:

1. Set the `baseUrl` to `http://localhost:8080/`
2. Set a custom `fhirUrlPath` to `fhir` versus the default `fhir/R4`
3. Add an override `getProfile` method to return a sample `Practitioner` resource
4. Add an override `getProjectMembership` method to return a sample `ProjectMembership` resource

Auth works out-of-the-box with Medplum. HAPI's starter bundle does not include any users, so you will need to create a user in HAPI to test the auth flow.

```diff
diff --git a/src/main.tsx b/src/main.tsx
index 58cfc84..c194f61 100644
--- a/src/main.tsx
+++ b/src/main.tsx
@@ -12,11 +12,37 @@ import { App } from './App';

 const medplum = new MedplumClient({
   onUnauthenticated: () => (window.location.href = '/'),
-  // baseUrl: 'http://localhost:8103/', // Uncomment this to run against the server on your localhost
+  baseUrl: 'http://localhost:8080/',
+  fhirUrlPath: 'fhir',
   cacheTime: 60000,
   autoBatchTime: 100,
+  extendedMode: false,
 });

+medplum.getProfile = () => {
+  return {
+    resourceType: 'Practitioner',
+    id: 'example-practitioner',
+    name: [{ given: ['John'], family: 'Doe' }],
+    identifier: [
+      {
+        system: 'http://example.com/identifiers',
+        value: '12345',
+      },
+    ],
+  };
+};
+
+medplum.getProjectMembership = () => {
+  return {
+    resourceType: 'ProjectMembership',
+    id: 'example-membership',
+    project: { reference: 'Project/example-project' },
+    user: { reference: 'User/123' },
+    profile: { reference: 'Practitioner/example-practitioner' },
+  };
+};
+
```

### About Medplum

[Medplum](https://www.medplum.com/) is an open-source, API-first EHR. Medplum makes it easy to build healthcare apps quickly with less code.

Medplum supports self-hosting and provides a [hosted service](https://app.medplum.com/). Medplum Hello World uses the hosted service as a backend.

- Read our [documentation](https://www.medplum.com/docs)
- Browse our [react component library](https://storybook.medplum.com/)
- Join our [Discord](https://discord.gg/medplum)
