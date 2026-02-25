import { useState, type FormEvent } from 'react'
import SoftBackdrop from '../components/SoftBackdrop'
import { ArrowRightIcon, MailIcon, MessageSquareTextIcon, UserIcon } from 'lucide-react'
import { motion } from 'motion/react'
import toast from 'react-hot-toast'

interface ContactForm {
  name: string
  email: string
  description: string
}

function Contact() {
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validation
    if (!form.name.trim() || !form.email.trim() || !form.description.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setSubmitting(true)

    try {
      // TODO: Replace with actual API call when DB is integrated
      console.log('Contact form submitted:', form)
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API delay

      toast.success('Message sent successfully! We\'ll get back to you soon.', {
        duration: 4000,
      })

      setForm({ name: '', email: '', description: '' })
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const springTransition = (stiffness: number) => ({
    type: 'spring' as const,
    stiffness,
    damping: 70,
    mass: 1,
  })

  return (
    <>
      <SoftBackdrop />
      <div className="mt-32 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32 pb-24">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={springTransition(320)}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
            Get in <span className="text-pink-500">Touch</span>
          </h1>
          <p className="text-zinc-400 mt-3 max-w-lg mx-auto leading-relaxed">
            Have a question, feedback, or just want to say hi? Fill out the form
            below and we'll get back to you as soon as possible.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="max-w-2xl mx-auto rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-8 md:p-10 shadow-2xl"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={springTransition(260)}
        >
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5 text-slate-300">

            {/* Name */}
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={springTransition(320)}
            >
              <label htmlFor="contact-name" className="block mb-2 font-medium text-sm">Your Name</label>
              <div className="flex items-center pl-3 rounded-lg border border-slate-700 focus-within:border-pink-500 transition-colors bg-white/[0.03]">
                <UserIcon className="size-5 text-zinc-500" />
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full p-3 outline-none bg-transparent placeholder:text-zinc-600"
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={springTransition(280)}
            >
              <label htmlFor="contact-email" className="block mb-2 font-medium text-sm">Email Address</label>
              <div className="flex items-center pl-3 rounded-lg border border-slate-700 focus-within:border-pink-500 transition-colors bg-white/[0.03]">
                <MailIcon className="size-5 text-zinc-500" />
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full p-3 outline-none bg-transparent placeholder:text-zinc-600"
                />
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              className="sm:col-span-2"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={springTransition(240)}
            >
              <label htmlFor="contact-description" className="block mb-2 font-medium text-sm">Description</label>
              <div className="flex items-start pl-3 pt-3 rounded-lg border border-slate-700 focus-within:border-pink-500 transition-colors bg-white/[0.03]">
                <MessageSquareTextIcon className="size-5 text-zinc-500 mt-0.5" />
                <textarea
                  id="contact-description"
                  name="description"
                  rows={6}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  className="w-full p-3 pt-0 pl-3 outline-none bg-transparent resize-none placeholder:text-zinc-600"
                />
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div
              className="sm:col-span-2"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={springTransition(200)}
            >
              <button
                type="submit"
                disabled={submitting}
                className="w-max flex items-center gap-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-10 py-3 rounded-full font-medium transition-all active:scale-95 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin size-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRightIcon className="size-5" />
                  </>
                )}
              </button>
            </motion.div>

          </form>
        </motion.div>
      </div>
    </>
  )
}

export default Contact