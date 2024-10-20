import requests
from collections import deque
import os
from groq import Groq

client = Groq(
    api_key="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",
    )

with open('C:/Users/gadhr/Desktop/DH/HoodieCoolLagi_Datahack/server/prompt.txt', 'r') as file:
    prompts = file.readlines()


def checkcatogory(prompt):
    completion = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {   
                "role": "user",
                "content": f'Analyze the following line: "{prompt}". Determine if it belongs to one of these categories: Network Security, Data Protection, Incident Response, or Compliance. Respond in only 1 word from "Network_Security", "Data_Protection", "Incident_Response", "Compliance", or "None". Make sure nothing else is said.'
            }
        ],
        temperature=1,
        top_p=1,
        stream=True,
        stop=None,
    )

    ans=list()
    for chunk in completion:
        ans.append(chunk.choices[0].delta.content or "")
        #print(chunk.choices[0].delta.content or "", end="")
    ans="".join(ans)
    return ans

def summarise(prompt):
    completion = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {   
                "role": "user",
                "content": f"""Given the following list of points, identify points that describe the same concept or idea. Then, group these points together based on their connection, provide a concise summary of how they are related, and expand on their common meaning in a simple and straightforward format:
                            {prompt}
                            Please ensure the response is limited to a summarized explanation of the connections between the grouped points and their shared meaning."""
            }
        ],
        temperature=1,
        top_p=1,
        stream=True,
        stop=None,
    )

    ans=list()
    for chunk in completion:
        ans.append(chunk.choices[0].delta.content or "")
        #print(chunk.choices[0].delta.content or "", end="")
    ans="".join(ans)
    return ans

def generateinitialquestions(prompt):
    completion = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {   
                "role": "user",
                "content": f"""
                                Given the following summary of points, identify the gaps in the information provided. Based on these gaps, generate specific questions to gather missing information or clarify any ambiguity. The output should be a list of questions, separated by commas, designed to complete or clarify the summary. Output only the questions in plain text format.
                                Summary: {prompt}
                                Return the questions, separated by commas.
                            """
            }
        ],
        temperature=1,
        top_p=1,
        stream=True,
        stop=None,
    )

    ans=list()
    for chunk in completion:
        ans.append(chunk.choices[0].delta.content or "")
        #print(chunk.choices[0].delta.content or "", end="")
    ans="".join(ans)
    ans=ans.split(',')
    ans=[item.strip() for item in ans]
    return ans


Network_Security = list()
Data_Protection = list()
Incident_Response = list()
Compliance = list()

for prompt in prompts:
    ans=checkcatogory(prompt)
    if ans=="Network_Security":Network_Security.append(prompt)
    elif ans=="Data_Protection":Data_Protection.append(prompt)
    elif ans=="Incident_Response":Incident_Response.append(prompt)
    elif ans=="Compliance":Compliance.append(prompt)

network_security_sum = summarise('.'.join(Network_Security))
data_protection_sum = summarise('.'.join(Data_Protection))
incident_response_sum = summarise('.'.join(Incident_Response))
compliance_sum = summarise('.'.join(Compliance))

network_security_questions=generateinitialquestions(network_security_sum)
data_protection_questions=generateinitialquestions(data_protection_sum)
incident_response_questions=generateinitialquestions(incident_response_sum)
compliance_questions=generateinitialquestions(compliance_sum)



print(f"Network Security questions: {network_security_questions}")
print(f"Data_protection_summary: {network_security_sum}")



