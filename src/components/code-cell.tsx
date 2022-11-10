import 'bulmaswatch/superhero/bulmaswatch.min.css'

import { useEffect, useState } from 'react'
import CodeEditor from './code-editor'
import Preview from './preview'
import { bundle } from '../bundler/index'
import Resizeable from './resizable'
import './resizable.css'
import { Cell } from '../state'
import { useActions } from '../hooks/use-actions'

interface CodeCellProps {
  cell: Cell
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }: CodeCellProps) => {
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  const { updateCell } = useActions()

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(cell.content)
      setCode(output.code)
      setErr(output.err)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [cell.content])

  return (
    <Resizeable direction='vertical'>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizeable direction='horizontal'>
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizeable>
        <Preview code={code} err={err} />
      </div>
    </Resizeable>
  )
}

export default CodeCell
