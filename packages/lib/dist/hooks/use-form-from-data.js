import { useCallback, useMemo, useRef, useState } from 'react';
export function useFormFromData(initialValues) {
    // initialValues 가 매 렌더 새 객체로 와도 reset 기준은 mount 시점값 고정
    const initialRef = useRef(initialValues);
    const [formData, setFormData] = useState(initialValues);
    const setField = useCallback((field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);
    const handleChange = useCallback((e) => {
        const target = e.target;
        const { name, type, value, checked } = target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, []);
    const reset = useCallback(() => {
        setFormData(initialRef.current);
    }, []);
    const isDirty = useMemo(() => {
        const init = initialRef.current;
        return Object.keys(init).some((k) => init[k] !== formData[k]);
    }, [formData]);
    return { formData, setFormData, setField, handleChange, reset, isDirty };
}
