// components/NewEntryDialog.tsx
'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { ImageUploader } from './ImageUploader'
import { createEntry } from '@/lib/supabase/entries'
import { useStore } from '@/lib/store'
import { useToast } from './ui/use-toast'
import { Loader2 } from 'lucide-react'

interface NewEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialMode?: 'text' | 'photo' | 'screenshot'
}

export function NewEntryDialog({
  open,
  onOpenChange,
  initialMode = 'text',
}: NewEntryDialogProps) {
  const [text, setText] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, couple } = useStore()
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!user || !couple) {
      console.error('[NewEntryDialog] Missing user or couple:', { user, couple })
      toast({
        title: 'Error',
        description: 'User or couple data not found. Please refresh and try again.',
        variant: 'destructive',
      })
      return
    }

    if (!text.trim() && images.length === 0) {
      toast({
        title: 'Nothing to save',
        description: 'Please write something or add photos',
        variant: 'destructive',
      })
      return
    }

    console.log('[NewEntryDialog] Submitting entry:', {
      coupleId: couple.id,
      textLength: text.length,
      imageCount: images.length,
      userId: user.id,
      userName: user.displayName,
    })

    setIsSubmitting(true)
    try {
      await createEntry(
        couple.id,
        text,
        user.id,
        user.displayName || 'You',
        user.photoURL,
        images
      )

      console.log('[NewEntryDialog] Entry created successfully')
      toast({
        title: 'Memory saved!',
        description: 'Your journal entry has been added',
      })

      setText('')
      setImages([])
      onOpenChange(false)
    } catch (error) {
      console.error('[NewEntryDialog] Error creating entry:', {
        error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })
      toast({
        title: 'Failed to save',
        description: error instanceof Error 
          ? `${error.message.slice(0, 100)}` 
          : 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {initialMode === 'photo' ? 'Add Photos' : initialMode === 'screenshot' ? 'Import Screenshot' : 'New Memory'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Textarea
            placeholder="What&apos;s on your mind? Write about your day, thoughts, or feelings..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="resize-none"
          />

          <ImageUploader onImagesSelected={setImages} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (!text.trim() && images.length === 0)}
            className="bg-blush-500 hover:bg-blush-600"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Memory
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
