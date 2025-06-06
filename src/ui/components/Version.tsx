import * as React from 'react'
import packageJson from '@/../package.json';

export const Version: React.FC = () => {

  return (
    <p className="text-sm text-muted-foreground dark:text-muted-foreground"> {packageJson.version}</p>
  )
}