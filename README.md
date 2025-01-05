<h3 align="center" style="margin-bottom: -10px">
	<img src="https://raw.githubusercontent.com/CarbonicSoda/vscode-latex-fold/master/media/icon.png" width="100" alt="LaTeX Fold Icon">
	<p></p>
	LaTeX Fold for VSCode
</h3>
<h4 align="center">Essential Folding Ranges Support for LaTeX</h4>

---

<h4 align="center">Designed to enhance VSCode with essential LaTeX folding range functionality</h5>

Adds support to fold the following section tags:

- `\part`
- `\chapter`
- `\section`
- `\subsection`
- `\subsubsection`
- `\paragraph`
- `\subparagraph`

and environment tags:

- `\begin{...}` - `\end{...}`

**Sections Folding**
![Section Folding Demo](https://github.com/CarbonicSoda/vscode-latex-fold/blob/master/media/demo-sections.png?raw=true)

> Section headers should not be malformed (_e.g._ without {}),
> else folding ranges will not be created.

**Environments Folding**
![Section Folding Demo](https://github.com/CarbonicSoda/vscode-latex-fold/blob/master/media/demo-envs.png?raw=true)

> Environment declaration commands should be balanced (_e.g._ no excess \end{}s)
> and never malformed (_e.g._ without {...}),
> else folding ranges will not be created.

---

<p>

_&emsp;Who would ever use MSWord if he got LaTeX...?_
