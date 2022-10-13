import { FC } from "react";

import Select from "react-select";

export type OptionType = {
  label: string;
  value: string;
};

type Props =
  | {
      multiple: false;
      options: OptionType[];
      selected: OptionType;
      onChange: (option: OptionType) => void;
      placeholder?: string;
    }
  | {
      multiple: true;
      options: OptionType[];
      selected: OptionType[];
      onChange: (option: OptionType[]) => void;
      placeholder?: string;
    };

const Dropdown: FC<Props> = ({
  options,
  selected,
  onChange,
  multiple,
  placeholder,
}) => {
  return (
    <Select
      placeholder={placeholder}
      options={options}
      value={selected}
      isMulti={multiple}
      onChange={(option) => {
        onChange(option as any);
      }}
      menuPortalTarget={document.body}
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1, // full width
          alignSelf: "stretch", // full height
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: "rgb(20,20,20)",
        }),
        control: (provided) => ({
          ...provided,
          height: "100%",
          boxShadow: "none",
          background: "rgb(20,20,20)",
          border: "1px solid rgb(255, 255, 255, 0.1) !important",
          borderRadius: "8px",
          padding: "3px",
        }),
        input: (provided) => ({
          ...provided,
          color: "rgb(255,255,255,0.9)",
        }),
        singleValue: (provided) => ({
          ...provided,
          color: "rgb(255,255,255,0.9)",
        }),
        multiValue: (styles) => {
          return {
            ...styles,
            backgroundColor: "rgb(191, 90, 242, 0.2)",
            borderRadius: "12px",
          };
        },
        multiValueLabel: (styles) => ({
          ...styles,
          color: "rgb(191, 90, 242)",
        }),
        multiValueRemove: (styles) => ({
          ...styles,
          color: "rgb(191, 90, 242)",
          cursor: "pointer",
          marginTop: "2px",
          ":hover": {
            color: "white",
          },
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          opacity: 0,
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isFocused
            ? "rgb(255, 255, 255, 0.1) !important"
            : state.isSelected
            ? "rgb(255, 255, 255, 0.1) !important"
            : "transparent",
          color: "rgb(255,255,255,0.9)",
          cursor: "pointer",
        }),
      }}
    />
  );
};

export default Dropdown;

export type { Props as DropdownProps };
