import React, { useState, useEffect } from 'react';
import { Flex, TextField, Button, Text } from '@adobe/react-spectrum';

export function InputGroup({
  label,
  placeholder,
  value: externalValue,
  onChange,
  buttonLabel,
  onSubmit,
  variant = 'primary',
  disabled = false,
}) {
  const [inputValue, setInputValue] = useState(externalValue || '');

  useEffect(() => {
    setInputValue(externalValue || '');
  }, [externalValue]);

  const handleChange = (val) => {
    setInputValue(val);
    onChange?.(val);
  };

  const handleSubmit = () => {
    onSubmit?.(inputValue);
    setInputValue('');
  };

  return (
    <Flex direction="column" alignItems="stretch" gap="size-100" width="100%">
      <Text>{label}</Text>
      <TextField
        contextualHelp={placeholder}
        value={inputValue}
        onChange={handleChange}
        width="100%"
      />
      <Button
        variant={variant}
        onPress={handleSubmit}
        isDisabled={disabled}
        width="100%"
      >
        {buttonLabel}
      </Button>
    </Flex>
  );
}

