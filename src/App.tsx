import { mockResources } from './resources/mockResources'
import type { Resource } from './resources/types'

interface AppProps {
  resources?: readonly Resource[]
}

export default function App({ resources = mockResources }: AppProps) {
  return <main>{resources.length} resources</main>
}
