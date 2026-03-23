import re
import sys

with open('agent-dashboard/components/SentientDashboard.tsx', 'r') as f:
    text = f.read()

# 1. Update ASCII TITLE BAR container for responsive
text = text.replace(
    '''<div className="w-full flex justify-center items-center pt-4 pb-2 shrink-0 z-10">''',
    '''<div className="w-full flex flex-col justify-center items-center pt-4 sm:pt-6 pb-2 shrink-0 z-10 px-4 sm:px-6 lg:px-8">'''
)
text = text.replace(
    '''<pre className="text-[#6ba368] font-bold text-sm sm:text-base md:text-lg leading-tight text-center select-none font-mono tracking-wide">''',
    '''<pre className="text-[#6ba368] font-bold text-[6px] sm:text-xs md:text-sm lg:text-base leading-tight text-center select-none font-mono tracking-wide overflow-hidden w-full max-w-full hidden sm:block">'''
)
# Add mobile ascii fallback title
text = text.replace(
    '''{ASCII_TITLE}''',
    '''{ASCII_TITLE}'''
)
# Wait, changing the pre to be hidden on mobile, need to display something on mobile instead. But let's just make it text-[5px] to fit mobile.
# Actually text-[8px] or just scale down with CSS transform. Or overflow-hidden.
