$path = "C:\Users\Punit\Desktop\H5P\New folder\modified\content\content.json"
$json = Get-Content $path -Raw -Encoding UTF8
$data = $json | ConvertFrom-Json
$content = $data.branchingScenario.content

# 1. Map Text Node IDs to image filenames
$imageMap = @{
    2  = "pushback.jpg"
    4  = "legal.jpg"
    6  = "backlash.jpg"
    8  = "workaround.jpg"
    10 = "regulator.jpg"
    12 = "deep-dive.jpg"
    14 = "dpia.jpg"
    16 = "boardroom.jpg"
}

# 2. Remove image credit text from AdvancedText nodes
foreach ($node in $content) {
    if ($node.type.library -eq "H5P.AdvancedText 1.1") {
        $text = $node.type.params.text
        # Regex to remove "Photo by...Unsplash" or "Illustration from Unsplash" lines
        # Matches patterns like: Photo by Name on Unsplash <p...
        # Or simply removes the credit text at the start of the string
        $text = $text -replace '(?s)^Photo by.*?Unsplash\s*', ''
        $text = $text -replace '(?s)^Illustration from.*?Unsplash\s*', ''
        $node.type.params.text = $text
    }
}

# 3. Insert Image Nodes and update BranchingQuestion alternatives
$newNodes = @()
$nextNewId = 100 # Start high IDs to avoid collision

foreach ($node in $content) {
    if ($node.type.library -eq "H5P.BranchingQuestion 1.0") {
        $alts = $node.type.params.branchingQuestion.alternatives
        for ($i = 0; $i -lt $alts.Count; $i++) {
            $targetTextId = $alts[$i].nextContentId
            if ($imageMap.ContainsKey($targetTextId)) {
                $imgFile = $imageMap[$targetTextId]
                $imgId = $nextNewId++
                
                # Create H5P.Image node
                $imgNode = [PSCustomObject]@{
                    type = [PSCustomObject]@{
                        library = "H5P.Image 1.1"
                        params = [PSCustomObject]@{
                            file = [PSCustomObject]@{
                                path = "images/$imgFile"
                                mime = "image/jpeg" # Default to jpeg, svg handled by filename if needed
                            }
                            alt = ""
                            title = ""
                        }
                        subContentId = [Guid]::NewGuid().ToString()
                    }
                    subContentId = [Guid]::NewGuid().ToString()
                    showContentTitle = $false
                    proceedButtonText = "Continue"
                    feedback = @{}
                    contentBehaviour = "useBehavioural"
                    forceContentFinished = "useBehavioural"
                    contentId = $imgId
                    nextContentId = $targetTextId
                }
                
                # Correct mime for svg
                if ($imgFile -like "*.svg") { $imgNode.type.params.file.mime = "image/svg+xml" }
                
                $newNodes += $imgNode
                
                # Update BQ alternative to point to image node
                $alts[$i].nextContentId = $imgId
            }
        }
    }
}

# Append new image nodes to content
$content += $newNodes

# Write back to JSON (No BOM)
$newJson = $data | ConvertTo-Json -Depth 10 -Compress
[System.IO.File]::WriteAllText($path, $newJson, [System.Text.UTF8Encoding]::new($false))
Write-Output "Modified successfully. Added $($newNodes.Count) image nodes."
