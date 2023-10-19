function highlightRow(button) {
    const row = button.closest('.memes-row');
    if (row) {
      row.classList.toggle('highlighted');
      const rowId = row.getAttribute('data-row-id');
      const isHighlighted = row.classList.contains('highlighted');

      localStorage.setItem(`highlightedRow-${rowId}`, isHighlighted);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.memes-row').forEach((row) => {
      const rowId = row.getAttribute('data-row-id');
      const isHighlighted = localStorage.getItem(`highlightedRow-${rowId}`);
      if (isHighlighted === 'true') {
        row.classList.add('highlighted');
      }
    });
  });