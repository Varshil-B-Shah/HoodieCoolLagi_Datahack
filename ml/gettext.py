import pytesseract
from PIL import Image
import fitz  # PyMuPDF
import os

# Path to tesseract executable (adjust it based on your installation)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # Update for your OS

def extract_text_from_image(image_path):
    """Extract text from a single image using pytesseract."""
    image = Image.open(image_path)
    return pytesseract.image_to_string(image)

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF using PyMuPDF (fitz) and fall back on OCR for images."""
    doc = fitz.open(pdf_path)
    text = ""

    for page_num in range(doc.page_count):
        page = doc.load_page(page_num)
        # Extract text from the page
        page_text = page.get_text("text")
        if page_text.strip():
            text += f"\n\n--- Page {page_num + 1} ---\n\n" + page_text
        else:
            # If no text is found, fall back to OCR (for scanned pages)
            pix = page.get_pixmap()
            image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            image_text = pytesseract.image_to_string(image)
            text += f"\n\n--- Page {page_num + 1} (OCR) ---\n\n" + image_text

    return text

def save_text_to_file(text, output_path):
    """Save extracted text to a text file."""
    with open(output_path, "w", encoding="utf-8") as text_file:
        text_file.write(text)

def process_file(file_path):
    """Process input PDF or image file."""
    if file_path.endswith('.pdf'):
        # Process PDF
        text = extract_text_from_pdf(file_path)
    elif file_path.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff')):
        # Process image
        text = extract_text_from_image(file_path)
    else:
        raise ValueError("Unsupported file format. Please provide a PDF or image file.")

    output_path = os.path.splitext(file_path)[0] + ".txt"
    save_text_to_file(text, output_path)
    print(f"Text extracted and saved to {output_path}")

# Example usage
file_path = "ml/DataHack 3.0 Problem Statements.pdf"  # Replace with the path to your PDF or image file
process_file(file_path)