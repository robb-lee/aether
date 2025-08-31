import * as React from 'react';
import { ClassValue } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
}
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
}
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'bordered';
    hover?: boolean;
    children: React.ReactNode;
}
declare const Card: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>;
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
declare const CardHeader: React.ForwardRefExoticComponent<CardHeaderProps & React.RefAttributes<HTMLDivElement>>;
interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
declare const CardBody: React.ForwardRefExoticComponent<CardBodyProps & React.RefAttributes<HTMLDivElement>>;
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
declare const CardFooter: React.ForwardRefExoticComponent<CardFooterProps & React.RefAttributes<HTMLDivElement>>;

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    children: React.ReactNode;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
}
declare const Modal: React.FC<ModalProps>;
interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
declare const ModalFooter: React.FC<ModalFooterProps>;

interface ToastProps {
    id: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    onClose: (id: string) => void;
}
declare const Toast: React.FC<ToastProps>;
interface ToastContainerProps {
    toasts: ToastProps[];
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}
declare const ToastContainer: React.FC<ToastContainerProps>;

/**
 * Utility function to merge Tailwind CSS classes with proper precedence
 * Combines clsx and tailwind-merge for optimal class merging
 */
declare function cn(...inputs: ClassValue[]): string;

export { Button, type ButtonProps, Card, CardBody, type CardBodyProps, CardFooter, type CardFooterProps, CardHeader, type CardHeaderProps, type CardProps, Input, type InputProps, Modal, ModalFooter, type ModalFooterProps, type ModalProps, Toast, ToastContainer, type ToastContainerProps, type ToastProps, cn };
