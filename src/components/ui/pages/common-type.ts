import { Dispatch, SetStateAction, SyntheticEvent, ChangeEvent } from 'react';

export type PageUIProps = {
  errorText: string | undefined;
  email: string;
  setEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: SyntheticEvent) => void;
};
