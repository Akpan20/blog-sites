import { body, param, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

/**
 * Utility to combine validation rules and the error handler
 */
const validate = (rules: ValidationChain[]): RequestHandler[] => [
  ...rules,
  handleValidationErrors,
];

/**
 * Validation rules for user registration
 */
const validateRegistration = validate([
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be between 3 and 30 characters and can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Must provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .withMessage('Password must be at least 8 characters and contain at least one letter and one number'),
]);

/**
 * Validation rules for user login
 */
const validateLogin = validate([
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Must provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
]);

/**
 * Validation rules for creating/updating a post
 */
const validatePost = validate([
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
]);

/**
 * Validation rules for creating/updating a comment
 */
const validateComment = validate([
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters'),
]);

/**
 * Validation rules for creating/updating a user
 */
const validateUser = validate([
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
]);

export {
  validateRegistration,
  validateLogin,
  validatePost,
  validateComment,
  validateUser,
};
