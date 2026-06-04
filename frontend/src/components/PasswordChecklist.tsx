import { passwordRequirements } from '@/schemas/auth'

export interface PasswordChecklistProps {
  password: string
}

function CheckIcon() {
  return (
    <svg
      width="8"
      height="6"
      viewBox="0 0 8 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1 3L3 5L7 1"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PasswordChecklist({ password }: PasswordChecklistProps) {
  return (
    <ul
      className="grid grid-cols-2 gap-y-[0.4375rem] gap-x-[0.875rem] mt-[0.625rem] list-none p-0 m-0
                 max-sm:grid-cols-1"
      role="list"
      aria-label="Password requirements"
    >
      {passwordRequirements.map(({ id, label, test }) => {
        const passed = test(password)
        return (
          <li
            key={id}
            className={`
              flex items-center gap-[0.4375rem] text-xs font-bold
              transition-colors duration-default ease-default
              ${passed ? 'text-success' : 'text-ink-500'}
            `}
            aria-label={`${label}: ${passed ? 'requirement met' : 'requirement not met'}`}
          >
            <span
              className={`
                w-[1.0625rem] h-[1.0625rem] rounded-[0.375rem] border-2
                grid place-items-center flex-none
                transition-all duration-default ease-default
                ${
                  passed
                    ? 'bg-success border-success'
                    : 'border-border-strong bg-transparent'
                }
              `}
              aria-hidden="true"
            >
              {passed && <CheckIcon />}
            </span>
            {label}
          </li>
        )
      })}
    </ul>
  )
}
