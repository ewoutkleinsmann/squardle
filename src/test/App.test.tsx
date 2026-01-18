import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
    it('renders the game', () => {
        render(<App />);
        expect(screen.getByTestId('game')).toBeInTheDocument();
    });
});
