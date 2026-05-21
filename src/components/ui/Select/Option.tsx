import classNames from 'classnames'
import { HiCheck } from 'react-icons/hi'
import type { ReactNode } from 'react'
import type { OptionProps as ReactSelectOptionProps } from 'react-select'

type DefaultOptionProps<T> = {
    customLabel?: (data: T, label: string) => ReactNode
}

const Option = <T,>(
    props: ReactSelectOptionProps<T> & DefaultOptionProps<T>,
) => {
    const { innerProps, label, isSelected, isDisabled, isFocused, data, customLabel } =
        props

    return (
        <div
            className={classNames(
                'select-option transition-all duration-150',
                isSelected && 'text-primary bg-primary/10 dark:bg-primary/20 font-bold',
                isFocused && !isSelected && 'bg-gray-100/70 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100',
                !isSelected && !isFocused && 'text-gray-600 dark:text-gray-400 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-gray-100',
                isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
            )}
            {...innerProps}
        >
            {customLabel ? (
                customLabel(data, label)
            ) : (
                <span className="ml-2">{label}</span>
            )}
            {isSelected && <HiCheck className="text-xl text-primary" />}
        </div>
    )
}

export default Option
