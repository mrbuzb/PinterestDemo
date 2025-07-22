namespace Pinterest.Application.Dto_s;

public class ConfirmCodeRequest
{
    public string Code { get; set; } = default!;
    public string Email { get; set; } = default!;
}