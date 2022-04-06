/* eslint-disable react/react-in-jsx-scope */
import {createConfig, deskTool, Studio} from 'sanity'
import {useMemo} from 'react'

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.setImmediate = window.setTimeout
}

export default function StudioRoot({basePath}: {basePath: string}) {
  const config = useMemo(
    () =>
      createConfig({
        plugins: [deskTool()],
        project: {
          name: 'Next.js Starter',
          basePath,
        },
        sources: [
          {
            name: 'default',
            projectId: 'ppsg7ml5',
            dataset: 'test',
            title: 'Default',
            schemaTypes: [
              {
                type: 'document',
                name: 'post',
                title: 'Post',
                fields: [
                  {
                    type: 'string',
                    name: 'title',
                    title: 'Title',
                  },
                ],
              },
            ],
          },
        ],
      }),
    [basePath]
  )

  return (
    <div style={{height: '100vh', width: '100vw'}}>
      <Studio config={config} />
    </div>
  )
}