
interface props {
  condition: boolean
  thenComponent: React.ReactElement
  elseComponent?: React.ReactElement
}

export function If({ condition, thenComponent, elseComponent }: props) {
  return (
    <>
      {condition ? thenComponent : elseComponent}
    </>
  )
}