import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import VideoItem from '@/components/VideoItem'

// Mock VideoItem props
const mockData = {
  id: "1",
  url: "http://example.com/video.mp4",
  username: "@testuser",
  description: "Test description",
  likes: 100,
}

describe('VideoItem', () => {
  it('renders username and description', () => {
    // Mock play/pause to avoid jsdom errors
    window.HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve())
    window.HTMLMediaElement.prototype.pause = vi.fn()

    render(<VideoItem data={mockData} isActive={true} />)

    expect(screen.getByText('@testuser')).toBeDefined()
    expect(screen.getByText('Test description')).toBeDefined()
    expect(screen.getByText('100')).toBeDefined()
  })
})
